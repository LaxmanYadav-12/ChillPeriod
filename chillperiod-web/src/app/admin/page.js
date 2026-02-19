import { auth } from "@/auth";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { redirect } from "next/navigation";
import UserTable from "./UserTable";
import ReportedSpots from "./ReportedSpots";
import MobileNav from "@/components/MobileNav";

export const metadata = {
  title: 'Admin Dashboard | ChillPeriod',
  description: 'Manage users and settings',
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  await dbConnect();

  // Fetch all users
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select('-password') // Exclude sensitive fields if any
    .lean();

  // Serialize for client component
  const serializedUsers = users.map(user => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    // Handle specific fields that might be ObjectIds
    following: user.following?.map(id => id.toString()) || [],
    followers: user.followers?.map(id => id.toString()) || [],
    attendanceLog: user.attendanceLog?.map(log => ({
      ...log,
      _id: log._id?.toString(),
      actions: log.actions?.map(action => ({
        ...action,
        _id: action._id?.toString(),
        courseId: action.courseId?.toString(),
      }))
    })) || [],
    courses: user.courses?.map(course => ({
      ...course,
      _id: course._id?.toString(),
    })) || []
  }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      <MobileNav />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', paddingTop: '80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage users, view stats, and monitor activity.
          </p>
        </div>

        {/* Stats Overview (Simple) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Users</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{users.length}</div>
          </div>
          {/* Add more stats here later if needed */}
        </div>

        <UserTable initialUsers={serializedUsers} />

        {/* Reported Spots Section */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>
            ⚠️ Reported Spots
          </h2>
          <ReportedSpots />
        </div>
      </div>
    </div>
  );
}
