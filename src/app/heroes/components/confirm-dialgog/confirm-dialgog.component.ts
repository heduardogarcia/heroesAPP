import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-confirm-dialgog',
  templateUrl: './confirm-dialgog.component.html',
  styles: [
  ]
})
export class ConfirmDialgogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialgogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: Hero,
  ) {
    console.log({data});
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
