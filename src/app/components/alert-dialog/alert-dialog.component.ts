import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { VideoTrialStoreSelectors, VideoTrialStoreState } from 'src/app/root-store/video-trial-store';
import { SharedService } from 'src/app/service/shared.service';


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {
  message: string = "";
  cancelButtonText = "";
  okButtonText = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    private store$: Store<VideoTrialStoreState.State>,
    private sharedService: SharedService) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        if (data.buttonText.cancel) {
          this.cancelButtonText = data.buttonText.cancel;
        }
        if (data.buttonText.ok) {
          this.okButtonText = data.buttonText.ok;
        }
      }
    }
    this.dialogRef.updateSize('600vw', '600vw')
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }
  updateMessage(d: any) {
    this.message = d.message;
  }
  resumeDownload = () => {
    this.dialogRef.close(true);
    this.store$
    .select(VideoTrialStoreSelectors.getUploadingFile)
    .pipe(take(1))
    .subscribe((res) => {
      this.sharedService.resumeAllFileUpload(res);
    });

  }


}
