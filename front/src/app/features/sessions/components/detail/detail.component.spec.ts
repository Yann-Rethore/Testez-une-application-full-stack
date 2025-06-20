import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {Router, ActivatedRoute } from '@angular/router';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { DetailComponent } from './detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// Mocks pour les tests
class MockSessionService {
  sessionInformation = { id: 1, admin: true }; 
}
class MockSessionApiService {
  detail = jest.fn();
  delete = jest.fn();
  participate = jest.fn();
  unParticipate = jest.fn();
}
class MockTeacherService {
  detail = jest.fn();
}

 
describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let mockSessionService: MockSessionService;
  let mockSessionApiService: MockSessionApiService;
  let mockTeacherService: MockTeacherService;
  let routerMock : {navigate : jest.Mock};;
  

  beforeEach(async () => {
    mockSessionService = new MockSessionService();
    mockSessionApiService = new MockSessionApiService();
    mockTeacherService = new MockTeacherService();
    

    mockSessionApiService.delete.mockReturnValue(of(undefined));
    mockSessionApiService.detail.mockReturnValue(of({ users: [], teacher_id: 1 })); // <-- AJOUT ICI
    mockTeacherService.detail.mockReturnValue(of({ id: 1, name: 'Prof' })); // Pour éviter d'autres erreurs
    
    routerMock = {
      navigate: jest.fn().mockResolvedValue(true) };

   

    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
        
      ],
      declarations: [DetailComponent], 
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService }, 
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }, 
        { provide: Router, useValue: routerMock }
        ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('should instantiate with correct sessionId, isAdmin, userId', () => {
    expect(component.sessionId).toBe('1');
    expect(component.isAdmin).toBe(true);
    expect(component.userId).toBe('1');
  });

});

// -------------------- TESTS D'INTEGRATION --------------------
describe('DetailComponent (integration)', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let mockSessionService: MockSessionService;
  let mockSessionApiService: MockSessionApiService;
  let mockTeacherService: MockTeacherService;
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    mockSessionService = new MockSessionService();
    mockSessionApiService = new MockSessionApiService();
    mockTeacherService = new MockTeacherService();

    mockSessionApiService.delete.mockReturnValue(of(undefined));
    mockSessionApiService.detail.mockReturnValue(of({ users: [], teacher_id: 1 }));
    mockTeacherService.detail.mockReturnValue(of({ id: 1, name: 'Prof' }));

    routerMock = { navigate: jest.fn().mockResolvedValue(true) };

await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent], 
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService }, 
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }, 
        { provide: Router, useValue: routerMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session and teacher, and set isParticipate', () => {
    const sessionMock = {
      users: [1, 2, 3],
      teacher_id: 42
    };
    const teacherMock = { id: 42, name: 'Prof' };
    mockSessionApiService.detail.mockReturnValue(of(sessionMock));
    mockTeacherService.detail.mockReturnValue(of(teacherMock));
    component['fetchSession']();
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(sessionMock);
    expect(component.isParticipate).toBe(true);
    expect(mockTeacherService.detail).toHaveBeenCalledWith('42');
    expect(component.teacher).toEqual(teacherMock);
  });

  it('should call participate and then fetchSession', () => {
    const participateSpy = mockSessionApiService.participate.mockReturnValue(of(undefined));
    const fetchSessionSpy = jest.spyOn(component as any, 'fetchSession');
    component.participate();
    expect(participateSpy).toHaveBeenCalledWith(component.sessionId, component.userId);
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

  it('should call unParticipate and then fetchSession', () => {
    const unParticipateSpy = mockSessionApiService.unParticipate.mockReturnValue(of(undefined));
    const fetchSessionSpy = jest.spyOn(component as any, 'fetchSession');
    component.unParticipate();
    expect(unParticipateSpy).toHaveBeenCalledWith(component.sessionId, component.userId);
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

   it('should call window.history.back on back()', () => {
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    component.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

