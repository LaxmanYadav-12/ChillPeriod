import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users/suggestions — "People You May Know" recommendations
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const currentUserId = session.user.id;

    // Fetch current user's data
    const currentUser = await User.findById(currentUserId)
      .select('semester section following followers')
      .lean();

    if (!currentUser) {
      return NextResponse.json({ suggestions: [] });
    }

    const followingIds = (currentUser.following || []).map(id => id.toString());
    const followerIds = (currentUser.followers || []).map(id => id.toString());
    const excludeIds = [...new Set([currentUserId, ...followingIds])];

    const suggestions = new Map(); // keyed by stringified _id

    // === STRATEGY 1: Same class (semester + section) ===
    if (currentUser.semester && currentUser.section) {
      const sameClassUsers = await User.find({
        _id: { $nin: excludeIds.map(id => id) },
        semester: currentUser.semester,
        section: currentUser.section,
        isPublic: { $ne: false },
      })
        .select('name username image college semester section totalBunks followers')
        .limit(15)
        .lean();

      for (const user of sameClassUsers) {
        const uid = user._id.toString();
        const mutualCount = (user.followers || []).filter(f =>
          followingIds.includes(f.toString())
        ).length;

        suggestions.set(uid, {
          ...user,
          _id: uid,
          reason: `Same class — ${currentUser.semester}th Sem ${currentUser.section}`,
          mutualCount,
          priority: 2, // high priority
        });
      }
    }

    // === STRATEGY 2: Friends-of-friends (mutual connections) ===
    if (followingIds.length > 0) {
      // Get the people that your followings are following
      const friendsOfFriends = await User.find({
        _id: { $nin: excludeIds.map(id => id) },
        followers: { $in: followingIds },
        isPublic: { $ne: false },
      })
        .select('name username image college semester section totalBunks followers')
        .limit(20)
        .lean();

      for (const user of friendsOfFriends) {
        const uid = user._id.toString();
        // Count how many of your followings also follow this person
        const mutualFollowers = (user.followers || []).filter(f =>
          followingIds.includes(f.toString())
        );
        const mutualCount = mutualFollowers.length;

        if (!suggestions.has(uid)) {
          // Find one mutual connection's name for the reason
          let reasonName = null;
          if (mutualFollowers.length > 0) {
            const mutualUser = await User.findById(mutualFollowers[0])
              .select('username name')
              .lean();
            if (mutualUser) {
              reasonName = mutualUser.username
                ? `@${mutualUser.username}`
                : mutualUser.name;
            }
          }

          const reason = mutualCount > 1
            ? `Followed by ${reasonName} and ${mutualCount - 1} other${mutualCount - 1 > 1 ? 's' : ''} you follow`
            : `Followed by ${reasonName || 'someone you follow'}`;

          suggestions.set(uid, {
            ...user,
            _id: uid,
            reason,
            mutualCount,
            priority: 1,
          });
        } else {
          // Already in suggestions from same-class, just bump mutual count
          const existing = suggestions.get(uid);
          existing.mutualCount = Math.max(existing.mutualCount, mutualCount);
        }
      }
    }

    // === STRATEGY 3: Followers you don't follow back ===
    const unfollowedBackIds = followerIds.filter(id => !followingIds.includes(id) && id !== currentUserId);
    if (unfollowedBackIds.length > 0) {
      const followBackUsers = await User.find({
        _id: { $in: unfollowedBackIds },
        isPublic: { $ne: false },
      })
        .select('name username image college semester section totalBunks followers')
        .limit(10)
        .lean();

      for (const user of followBackUsers) {
        const uid = user._id.toString();
        if (!suggestions.has(uid)) {
          suggestions.set(uid, {
            ...user,
            _id: uid,
            reason: 'Follows you',
            mutualCount: 0,
            priority: 3,
          });
        }
      }
    }

    // Sort: higher priority first, then by mutual connections
    const sorted = Array.from(suggestions.values())
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return b.mutualCount - a.mutualCount;
      })
      .slice(0, 10)
      .map(({ priority, followers, ...rest }) => rest); // strip internal fields

    return NextResponse.json({ suggestions: sorted });
  } catch (error) {
    console.error('[suggestions GET]', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
