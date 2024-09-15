import { Component, OnInit } from '@angular/core';
import { FrameworkDetails } from '../../model/entity';
import { EntityService } from '../../services/EntityService/Entity.service';
import { AuthService } from '../../services/AuthService/auth.service';

@Component({
  selector: 'app-FrameworkDetails',
  templateUrl: './FrameworkDetails.component.html',
  styleUrls: ['./FrameworkDetails.component.css']
})
export class FrameworkDetailsComponent implements OnInit {
  frameworkDetails: FrameworkDetails[] | undefined;

  constructor(private entityService: EntityService,private authService: AuthService) { }

  ngOnInit(): void {
    const token =this.authService.getToken();
    this.loadFrameworkDetails(token);
  }

  loadFrameworkDetails(token: string): void {
    this.entityService.getAllFrameworkDetails(token).subscribe(
      (details) => this.frameworkDetails = details,
      (error) => console.error('Error fetching framework details', error)
    );
  }
}