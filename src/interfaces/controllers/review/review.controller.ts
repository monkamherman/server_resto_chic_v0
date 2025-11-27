import { Body, Controller, Get, Post, Param, UseGuards, Req, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewService } from '../../../domain/services/review.service';
import { CreateReviewDto } from '../../../application/dtos/review/create-review.dto';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/security/guards/roles.guard';
import { Roles } from '../../../infrastructure/security/decorators/roles.decorator';
import { Role } from '../../../domain/enums/role.enum';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(req.user.userId, createReviewDto);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  async getUserReviews(@Req() req) {
    return this.reviewService.getUserReviews(req.user.userId);
  }

  @Post(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async moderateReview(
    @Param('id') id: string,
    @Body('isApproved') isApproved: boolean,
    @Body('adminResponse') adminResponse?: string
  ) {
    return this.reviewService.moderateReview(id, isApproved, adminResponse);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Param('id') id: string, @Req() req) {
    // Vérifier si l'utilisateur est l'auteur de l'avis ou un admin
    const review = await this.reviewService.getReviewById(id);
    if (review.user_id !== req.user.userId && !req.user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException('Not authorized to delete this review');
    }
    
    await this.reviewService.deleteReview(id);
  }
}
