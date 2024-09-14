import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseService } from '../../services/ResponseService/Response.service';
import { EntityService } from '../../services/EntityService/Entity.service';
import {
  QuestionnaireAssignmentResponseDto,
  QuestionResponseDto,
} from '../../model/QuestionOptionResponseDto';
import { saveAs } from 'file-saver';
import { AuthService } from '../../services/AuthService/auth.service';
import { Location } from '@angular/common';
import { Domain } from '../../model/entity';

@Component({
  selector: 'app-ResponsePage',
  templateUrl: './ResponsePage.component.html',
  styleUrls: ['./ResponsePage.component.scss'],
})
export class ResponsePageComponent implements OnInit {
  assignmentID: number | undefined;
  responses: QuestionnaireAssignmentResponseDto | undefined;
  domains: Set<number> = new Set();
  domainNames: Map<number, string> = new Map();
  selectedDomain: number | undefined;
  filteredQuestions: QuestionResponseDto[] = [];
  toggledSubParts: { [key: string]: boolean } = {};

  constructor(
    private router: Router,
    private responseService: ResponseService,
    private entityService: EntityService,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.assignmentID = state.assignmentID;

    this.loadResponses();
  }

  loadResponses(): void {
    this.responseService
      .getResponsesForAssignment(this.assignmentID!)
      .subscribe(
        (responses) => {
          this.responses = responses;
          console.log('Responses received:', responses);
          this.extractDomains();
        },
        (error) => {
          console.error('Error loading responses:', error);
        }
      );
  }

  toggleSubPart(categoryID: number): void {
    this.toggledSubParts[categoryID] = !this.toggledSubParts[categoryID];
  }

  isSubPartToggled(categoryID: number): boolean {
    return !!this.toggledSubParts[categoryID];
  }

  extractDomains(): void {
    if (this.responses) {
      // Extract unique domain IDs
      this.responses.questions.forEach((question) => {
        this.domains.add(question.domainID);
      });

      // Fetch domain names for all domain IDs
      this.fetchDomainNames();
    }
  }

  fetchDomainNames(): void {
    const token = this.authService.getToken();

    this.domains.forEach((domainID) => {
      this.entityService.GetDomainById(domainID, token).subscribe(
        (domain: Domain) => {
          this.domainNames.set(domain.domainID, domain.domainName);
        },
        (error) => {
          console.error(`Error fetching domain ${domainID}:`, error);
        }
      );
    });
  }

  getQuestionsByDomain(domainID: number): QuestionResponseDto[] {
    return (
      this.responses?.questions.filter(
        (question) => question.domainID === domainID
      ) || []
    );
  }

  goBack(): void {
    this.location.back();
  }

  downloadFile(filePath: string, fileName: string): void {
    this.responseService.downloadFile(filePath).subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        saveAs(blob, fileName); // Use file-saver to download the file
      },
      (error: any) => {
        console.error('File download failed:', error);
      }
    );
  }
}
