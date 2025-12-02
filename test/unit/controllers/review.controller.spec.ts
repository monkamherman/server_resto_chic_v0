import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from '../../../../src/domain/review/review.controller';
import { ReviewService } from '../../../../src/domain/services/review.service';
import { CreateReviewDto } from '../../../../src/application/dtos/review/create-review.dto';
import { UpdateReviewDto } from '../../../../src/application/dtos/review/update-review.dto';
import { UserRole } from '../../../../src/domain/enums/user-role.enum';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  const mockReviewService = {
    createReview: jest.fn(),
    getDishReviews: jest.fn(),
    getReviewById: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
    moderateReview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      const userId = 'user-123';
      const createReviewDto: CreateReviewDto = {
        dishId: 'dish-123',
        rating: 5,
        comment: 'Excellent plat!',
      };

      const createdReview = {
        id: 'review-123',
        user_id: userId,
        dish_id: createReviewDto.dishId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        is_approved: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockReviewService.createReview.mockResolvedValue(createdReview);

      const req = { user: { id: userId } };
      const result = await controller.create(req, createReviewDto);

      expect(service.createReview).toHaveBeenCalledWith(userId, createReviewDto);
      expect(result).toEqual(createdReview);
    });
  });

  describe('getByDishId', () => {
    it('should return reviews for a dish', async () => {
      const dishId = 'dish-123';
      const reviews = [
        {
          id: 'review-1',
          dish_id: dishId,
          rating: 5,
          comment: 'Excellent!',
          is_approved: true,
        },
      ];

      mockReviewService.getDishReviews.mockResolvedValue(reviews);

      const result = await controller.getByDishId(dishId);

      expect(service.getDishReviews).toHaveBeenCalledWith(dishId);
      expect(result).toEqual(reviews);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const userId = 'user-123';
      const reviewId = 'review-123';
      const updateReviewDto: UpdateReviewDto = {
        comment: 'Updated comment',
        rating: 4,
      };

      const updatedReview = {
        id: reviewId,
        user_id: userId,
        dish_id: 'dish-123',
        ...updateReviewDto,
        is_approved: true,
      };

      mockReviewService.getReviewById.mockResolvedValue({ user_id: userId });
      mockReviewService.updateReview.mockResolvedValue(updatedReview);

      const req = { user: { id: userId } };
      const result = await controller.update(req, reviewId, updateReviewDto);

      expect(service.updateReview).toHaveBeenCalledWith(reviewId, updateReviewDto);
      expect(result).toEqual(updatedReview);
    });

    it('should throw ForbiddenException when updating another user review', async () => {
      const reviewId = 'review-123';
      const updateReviewDto: UpdateReviewDto = {
        comment: 'Updated comment',
      };

      mockReviewService.getReviewById.mockResolvedValue({ 
        user_id: 'another-user',
      });

      const req = { user: { id: 'current-user' } };

      await expect(controller.update(req, reviewId, updateReviewDto)).rejects.toThrow(
        'Vous ne pouvez pas modifier cet avis',
      );
    });
  });

  describe('remove', () => {
    it('should delete a review', async () => {
      const userId = 'user-123';
      const reviewId = 'review-123';
      
      mockReviewService.getReviewById.mockResolvedValue({ 
        id: reviewId, 
        user_id: userId 
      });
      mockReviewService.deleteReview.mockResolvedValue(true);

      const req = { 
        user: { 
          id: userId,
          role: UserRole.USER 
        } 
      };
      
      await controller.remove(req, reviewId);
      
      expect(service.deleteReview).toHaveBeenCalledWith(reviewId);
    });
  });

  describe('approveReview', () => {
    it('should approve a review', async () => {
      const reviewId = 'review-123';
      const approvedReview = {
        id: reviewId,
        is_approved: true,
      };

      mockReviewService.moderateReview.mockResolvedValue(approvedReview);

      const result = await controller.approveReview(reviewId);

      expect(service.moderateReview).toHaveBeenCalledWith(reviewId, true);
      expect(result).toEqual(approvedReview);
    });
  });
});
