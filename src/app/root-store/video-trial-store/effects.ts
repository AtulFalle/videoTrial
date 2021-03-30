import { FileUploadStatus } from './../../core/enum/file-upload-status.enum';
import { environment } from './../../../environments/environment.prod';
import { BlobUploadResponse } from './../../core/models/file-upload.model';
import { SharedService } from './../../service/shared.service';
import { MessageBoxService } from './../../core/message-dialog-box/message-box.service';
import { ProcedureService } from './../../core/services/procedure-service/procedure.service';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  switchMap,
  mergeMap,
} from 'rxjs/operators';

import * as videoTrialActions from './actions';
import { Procedure } from 'src/app/core/models/procedure.model';
import { DeleteAnnotation } from 'src/app/core/models/annotations.model';
import { AdminService } from 'src/app/admin/admin.service';
import { User } from 'src/app/core/models/admin.model';

@Injectable()
export class VideoTrialStoreEffects {
  constructor(
    private actions$: Actions,
    private procedureService: ProcedureService,
    private messageBoxService: MessageBoxService,
    private adminService: AdminService,
    private sharedService: SharedService
  ) {}

  @Effect()
  getAllProcedures = this.actions$.pipe(
    ofType(videoTrialActions.getAllProcedures),
    switchMap((action) => this.procedureService.getAllProcedures()),
    switchMap((procedures: Procedure[]) => {
      return of(
        videoTrialActions.getAllProcedureSuccess({
          procedures,
        })
      );
    })
  );

  @Effect()
  getMeatadataInformation = this.actions$.pipe(
    ofType(videoTrialActions.getProcedure),
    switchMap((action) =>
      this.procedureService.getProcedure(action.procedureID)
    ),
    switchMap((procedure: Procedure) => {
      return of(
        videoTrialActions.getProcedureSuccess({
          procedure,
        })
      );
    })
  );

  @Effect()
  deleteAnnotation = this.actions$.pipe(
    ofType(videoTrialActions.deleteAnnotation),
    switchMap((action) => {
      return this.procedureService
        .deleteAnnotation(action.procedureId, action.videoId, action.id)
        .pipe(
          switchMap((res: DeleteAnnotation) => {
            this.messageBoxService.openSuccessMessage(
              'annotation Deleted successfully'
            );
            return of(
              videoTrialActions.deleteAnnotationSuccess({
                procedureId: action.procedureId,
                videoId: action.videoId,
                id: action.id,
              })
            );
          }),
          catchError((e) => {
            this.messageBoxService.openErrorMessage(
              'error while Deleting annotation'
            );
            return e;
          })
        );
    })
  );

  /**
   * add annotation action calls AddAnnotation API and updates store with new values
   */
  @Effect()
  addAnnotation = this.actions$.pipe(
    ofType(videoTrialActions.addAnnotations),
    switchMap((action) => {
      return this.procedureService
        .updateAnnotationList(
          action.procedureId,
          action.videoId,
          action.annotationsList
        )
        .pipe(
          switchMap((res: Procedure) => {
            this.messageBoxService.openSuccessMessage(
              'annotation added successfully'
            );
            return of(
              videoTrialActions.addAnnotationsSucces({
                procedureId: action.procedureId,
                videoId: action.videoId,
                annotationsList: action.annotationsList,
              })
            );
          }),
          catchError((e) => {
            this.messageBoxService.openErrorMessage(
              'error while adding annotation'
            );
            return e;
          })
        );
    })
  );
  @Effect()
  getAllUsers = this.actions$.pipe(
    ofType(videoTrialActions.getAllUser),
    switchMap((action) => this.adminService.getAllUsers()),
    switchMap((users: User[]) => {
      return of(
        videoTrialActions.getAllUserSuccess({
          users,
        })
      );
    })
  );

  @Effect()
  updateserStatus = this.actions$.pipe(
    ofType(videoTrialActions.updateUserStatusAdmin),
    switchMap((action) => {
      return this.adminService
        .updateUserStatus(action.objectId, action.selectedRole)
        .pipe(
          switchMap((res: any) => {
            this.messageBoxService.openSuccessMessage(
              'User Status updated successfully'
            );
            return of(
              videoTrialActions.updateUserStatusAdminSuccess({
                user: res,
              })
            );
          }),
          catchError((e) => {
            this.messageBoxService.openErrorMessage('Error while User Status');
            return e;
          })
        );
    })
  );

  // chunk upload effects

  @Effect()
  sendChunk = this.actions$.pipe(
    ofType(videoTrialActions.sendChunk),
    switchMap((action) =>
      this.sharedService.appendChunk(action.file).pipe(
        map((res) => {
          return {
            blob: res,
            action,
          };
        })
      )
    ),
    switchMap((res: { blob: BlobUploadResponse; action: any }) => {
      if (res.action.file.status === FileUploadStatus.IN_PROGRESS) {
        return of(
          videoTrialActions.sendChunkSuccess({
            file: res.action.file,
            chunkDetails: {
              blockId: res.blob.blockId,
              chunkEnd: res.action.file.lastChunk + environment.CHUNK_SIZE,
            },
          })
        );
      } else {
        return of(
          videoTrialActions.updateStatus({
            file: res.action.file,
            status: res.action.file.status,
          })
        );
      }
    })
  );

  @Effect()
  sendChunkSuccess = this.actions$.pipe(
    ofType(videoTrialActions.sendChunkSuccess),
    switchMap((action) =>
      this.sharedService.appendChunk(action.file).pipe(
        map((res) => {
          return {
            blob: res,
            action,
          };
        })
      )
    ),
    switchMap((res: { blob: BlobUploadResponse; action: any }) => {
      if (res.action.file.status === FileUploadStatus.IN_PROGRESS) {
        const chunkSize = res.action.file.lastChunk + environment.CHUNK_SIZE;
        if (chunkSize > res.action.file.size) {
          return of(
            videoTrialActions.updateStatus({
              file: res.action.file,
              status: FileUploadStatus.CHUNK_COMPLETED,
            })
          );
        }
        return of(
          videoTrialActions.sendChunkSuccess({
            file: res.action.file,
            chunkDetails: {
              blockId: res.blob.blockId,
              chunkEnd: res.action.file.lastChunk + environment.CHUNK_SIZE,
            },
          })
        );
      } else {
        return of(
          videoTrialActions.updateStatus({
            file: res.action.file,
            status: res.action.file.status,
          })
        );
      }
    })
  );

  // @Effect()
  // sendChunkSuccess = this.actions$.pipe(
  //   ofType(videoTrialActions.sendChunkSuccess),
  //   switchMap((action) => {
  //     return this.sharedService.appendChunk(action.file).pipe(
  //       switchMap((res: BlobUploadResponse) => {
  //         if (action.file.status === FileUploadStatus.IN_PROGRESS) {
  //           const chunkSize = action.file.lastChunk + environment.CHUNK_SIZE;

  //           if (chunkSize > action.file.size) {
  //             return of(
  //               videoTrialActions.updateStatus({
  //                 file: action.file,
  //                 status: FileUploadStatus.CHUNK_COMPLETED,
  //               })
  //             );
  //           }
  //           return of(
  //             videoTrialActions.sendChunkSuccess({
  //               file: action.file,
  //               chunkDetails: {
  //                 blockId: res.blockId,
  //                 chunkEnd: action.file.lastChunk + environment.CHUNK_SIZE,
  //               },
  //             })
  //           );
  //         } else {
  //           return of(
  //             videoTrialActions.updateStatus({
  //               file: action.file,
  //               status: action.file.status,
  //             })
  //           );
  //         }
  //       }),
  //       catchError((e) => {
  //         return of(
  //           videoTrialActions.updateStatus({
  //             file: action.file,
  //             status: FileUploadStatus.ERROR,
  //           })
  //         );
  //       })
  //     );
  //   })
  // );
}
