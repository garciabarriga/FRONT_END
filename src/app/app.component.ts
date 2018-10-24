import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
//const IntroJs = require('../../node_modules/intro.js');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Se define la clase AppComponent que implementará la interfaz OnInit
    ngOnInit(): void {
    // Si en la sesión del navegador web se encuentra almacenado el ítem usuario con valor nulo
        if (sessionStorage.getItem('usuario') === null) {
            this.login.isLogin = false; // Se asigna falso en la propiedad isLogin
        } else { // Caso contrario
    // En usd se asigna el ítem usuario almacenado en la sesión del navegador web
            const usd: any = sessionStorage.getItem('usuario');
    // En mnud se asigna el ítem menu almacenado en la sesión del navegador web
            const mnud: any = sessionStorage.getItem('menu');
    // En la propiedad modelMenu se asigna mnud en formato JSON
            this.login.modelMenu = JSON.parse(mnud);
    // En la propiedad usuario se asigna usd en formato JSON
            this.login.usuario = JSON.parse(usd);
    // Se estable la propiedad isLogin como verdadera
            this.login.isLogin = true;
    // Se llama al método obtenerNotificaciones de login pasándole como entrada el usuario
            this.login.obtenerNotificaciones(this.login.usuario);
        }
    }
    // tslint:disable-next-line:member-ordering
    @ViewChild(LoginComponent) login: LoginComponent;
    startMenu($event) {
        console.log('Starting tour');
        this.onRightPanelButtonClick($event)
        /*const intro = IntroJs.introJs();
        intro.goToStepNumber(69).start();*/

    
      }
    // tslint:disable-next-line:member-ordering
    menuMode = 'static';

    // tslint:disable-next-line:member-ordering
    topbarMenuActive: boolean;

    // tslint:disable-next-line:member-ordering
    overlayMenuActive: boolean;

    // tslint:disable-next-line:member-ordering
    staticMenuDesktopInactive: boolean;

    // tslint:disable-next-line:member-ordering
    staticMenuMobileActive: boolean;

    // tslint:disable-next-line:member-ordering
    layoutMenuScroller: HTMLDivElement;

    // tslint:disable-next-line:member-ordering
    lightMenu = true;

    // tslint:disable-next-line:member-ordering
    menuClick: boolean;

    // tslint:disable-next-line:member-ordering
    topbarItemClick: boolean;

    // tslint:disable-next-line:member-ordering
    activeTopbarItem: any;

    // tslint:disable-next-line:member-ordering
    resetMenu: boolean;

    // tslint:disable-next-line:member-ordering
    menuHoverActive: boolean;

    // tslint:disable-next-line:member-ordering
    rightPanelActive: boolean;

    // tslint:disable-next-line:member-ordering
    rightPanelClick: boolean;

    // perfiles=this.login.perfiles;

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.isOverlay()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
            //console.log(event);
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    isHorizontal() {
        return this.menuMode === 'horizontal';
    }

    isSlim() {
        return this.menuMode === 'slim';
    }

    isOverlay() {
        return this.menuMode === 'overlay';
    }

    isStatic() {
        return this.menuMode === 'static';
    }

    isMobile() {
        return window.innerWidth < 1025;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }
}
