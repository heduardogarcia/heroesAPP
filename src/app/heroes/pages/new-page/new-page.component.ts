import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialgogComponent } from '../../components/confirm-dialgog/confirm-dialgog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm= new FormGroup({
    id:  new FormControl<string>(''),
    superhero:  new FormControl<string>('',{nonNullable:true}) ,
    publisher:  new FormControl<Publisher>(Publisher.DCComics) ,
    alter_ego:  new FormControl('') ,
    first_appearance:  new FormControl(''),
    characters:  new FormControl('') ,
    alt_img:  new FormControl('')
  });

  public publishers=[
    {     id:'DC Comics', desc: 'DC-Comics' },

    {     id:'Marvel Comics', desc: 'MArvel-Comics' },
  ];

  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,){}
  ngOnInit(): void {

    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroById(id)),
      ).subscribe( hero => {
        if(!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      });

  }
// se ejecutan funiones del back e tr

get currentHero():  Hero{
  const hero= this.heroForm.value as Hero;
  return hero;
}
  onSubmit():void{
    // console.log({formIsValid: this.heroForm.valid , value: this.heroForm.value,});
    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} updated!`);

        });
        return;
      }
      this.heroesService.addHero(this.currentHero)
      .subscribe(hero =>{

        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${hero.superhero} Created!`);

      })
    // this.heroesService.updateHero(this.heroForm.value);


  }

  onDeleteHero(){
    if(!this.currentHero.id) throw Error('Hero id es required');

    const dialogRef = this.dialog.open(ConfirmDialgogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter((result:boolean)=>result),
      // tap(result=>console.log(result))
      switchMap(()=>this.heroesService.deleteHeroById(this.currentHero.id)),
      // tap(wasDeleted =>console.log({wasDeleted})),
      filter((wasDeleted:boolean) =>wasDeleted),
    )
    .subscribe(() =>{
      // console.log({result});
      this.router.navigate(['/heroes']);

    })


    // dialogRef.afterClosed().subscribe(result => {

    //   if(!result) return;
    //   console.log('delete');
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //    .subscribe(wasDeleted =>{
    //     if(wasDeleted)
    //       this.router.navigate(['/heroes']);

    //    })

    // });
  }
  showSnackBar(message:string):void{
    this.snackBar.open(message,'done', {
      duration:2500
    })
  }



}
