import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
// import { HEROES} from '../mock-heroes';
import { HeroService } from '../hero.service'
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  // hero = 'Windstorm';
  /* hero:Hero = {
    id:1,
    name:'Windstorm'
  }; */
  // selectedHero:Hero;
  // heroes = HEROES;
  heroes: Hero[];

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  // onSelect(hero:Hero):void {
  //   this.selectedHero = hero;
  // }

  getHeroes(): void {
    /*  // 同步赋值
     this.heroes = this.heroService.getHeroes(); */

    // 解决请求网络数据过程中的异步
    this.heroService.getHeroes()
      .subscribe(heroes => {
        this.heroes = heroes;
      })
  }

  add(name:string){
    name = name.trim();
    if(!name){
      return ;
    }
    this.heroService.addHero({name} as Hero)
    .subscribe(hero => {
      this.heroes.push(hero);
    })
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
