import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { CreateCommunitySchema, ApproveMemberSchema } from '@/types/schemas/community';
import { CommunityController } from '../controllers/CommunityController';

const router = Router();
const communityController = new CommunityController();

// Get community by slug
router.get('/:slug', communityController.getBySlug);

// Create community (admin only)
router.post('/', requireAuth, validate(CreateCommunitySchema), communityController.create);

// Get community members
router.get('/:id/members', communityController.getMembers);

// Approve member
router.post('/:id/members/approve', requireAuth, validate(ApproveMemberSchema), communityController.approveMember);

export { router as communityRoutes };
