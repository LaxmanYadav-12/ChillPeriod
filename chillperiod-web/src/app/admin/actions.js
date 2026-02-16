'use server';

import { auth } from "@/auth";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    // Check permissions: Admin can delete anyone, User can only delete themselves
    const isAdmin = session.user.role === 'admin';
    const isSelf = session.user.id === userId;

    if (!isAdmin && !isSelf) {
      return { error: "You don't have permission to perform this action" };
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return { error: "User not found" };
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
}

export async function updateUser(userId, data) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    // Allowed fields to update
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.username) updateData.username = data.username;
    if (data.role) updateData.role = data.role;
    if (data.college) updateData.college = data.college;
    if (data.semester) updateData.semester = Number(data.semester);
    if (data.section) updateData.section = data.section;
    if (data.group) updateData.group = data.group;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { error: "User not found" };
    }

    revalidatePath('/admin');
    return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: error.message || "Failed to update user" };
  }
}
