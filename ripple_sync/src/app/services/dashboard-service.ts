import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface DashboardTotal {
  publishedPosts: number;
  scheduledPosts: number;
  totalReach: number;
  totalLikes: number;
  totalStatsForPlatforms: Array<StatsForPlatform>;
}

interface StatsForPlatform{
  platform: string;
  publishedPosts: number;
  reach: number;
  likes: number;
  engagement: number;
  averageEngagement: number;
  isSimulated: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _dashboardData = httpResource<DashboardTotal>(() => `${environment.apiUrl}/dashboard/total`);
  
  get dashboardData() {
    return this._dashboardData.asReadonly();
  }

  reloadDashboardData() {
    this._dashboardData.reload();
  }
}
