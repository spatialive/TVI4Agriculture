import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';
import {MenuItem} from 'primeng/api';

@Component({
    templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit{

    items: MenuItem[];

    revenueChart: any;

    revenueOptions: any;

    activeTab = 0;

    activeListItemIndex = 1;

    activeListItem = {image: 'assets/layout/images/dashboard/headphones.svg', text: 'HF Headphones', subtext: 'Wireless', ratio: '+24%'};

    listItems: any[];

    chatMessages: any[];

    @ViewChild('chatcontainer') chatContainerViewChild: ElementRef;

    constructor(public app: AppComponent) {}

    ngOnInit() {
        this.items = [
            { label: 'Edit', icon: 'pi pi-pencil' },
            { label: 'Delete', icon: 'pi pi-trash' }
        ];

        this.revenueChart = {
            labels: [
                'Online',
                'Retail',
                'N/A'
            ],
            datasets: [{
                data:  [12, 32, 56],
                backgroundColor: [  '#1992D4', '#3E4C59', '#E4E7EB'],
                borderWidth: 0,
            }]
        };

        this.revenueOptions = {
            plugins: {
                legend: {
                    display: false,
                }
            },
            responsive: true,
            cutout: 60
        };

        this.listItems = [
            {image: 'assets/layout/images/dashboard/sneaker.png', text: 'Red Sneakers', subtext: 'RX Series', ratio: '+40%'},
            {image: 'assets/layout/images/dashboard/headphones.png', text: 'HF Headphones', subtext: 'Wireless', ratio: '+24%'},
            {image: 'assets/layout/images/dashboard/sunglasses.png', text: 'Sunglasses', subtext: 'UV Protection', ratio: '+17%'}
        ];

        this.chatMessages = [
            { nth: true, from: 'Jane Cooper', url: 'assets/demo/images/avatar/stephenshaw.png', messages: ['Hey M. hope you are well. Our idea is accepted by the board. '] },
            { nth: false, from: 'Jerome Bell', url: 'assets/demo/images/avatar/ivanmagalhaes.png', messages: ['we did it! 🤠'] },
            { nth: true, from: 'Darlene Robertson', url: 'assets/demo/images/avatar/amyelsner.png', messages: ['I’ll be looking at the process then, just to be sure 🤓 '] },
        ];
    }

    onTabClick(event, index) {
        this.activeTab = index;

        if (index === 0) {
            this.listItems = [
                {image: 'assets/layout/images/dashboard/sneaker.png', text: 'Red Sneakers', subtext: 'RX Series', ratio: '+40%'},
                {image: 'assets/layout/images/dashboard/headphones.png', text: 'HF Headphones', subtext: 'Wireless', ratio: '+24%'},
                {image: 'assets/layout/images/dashboard/sunglasses.png', text: 'Sunglasses', subtext: 'UV Protection', ratio: '+17%'}
            ];
        } else if (index === 1) {
            this.listItems = [
                {image: 'assets/layout/images/dashboard/camera.png', text: 'Instant Camera', subtext: 'II-Mark', ratio: '+27%'},
                {image: 'assets/layout/images/dashboard/cupcake.png', text: 'Cupcake', subtext: 'Cinnamon', ratio: '+41%'},
                {image: 'assets/layout/images/dashboard/drink.png', text: 'Cold Drink', subtext: 'Lime', ratio: '+56%'}
            ];
        } else if (index === 2) {
            this.listItems = [
                {image: 'assets/layout/images/dashboard/tripod.png', text: 'Tripod', subtext: 'Stabilizer', ratio: '+34%'},
                {image: 'assets/layout/images/dashboard/headphone2.png', text: 'Headphone', subtext: 'Wireless', ratio: '+67%'},
                {image: 'assets/layout/images/dashboard/spoon.png', text: 'Spoon Set', subtext: 'Colorful', ratio: '+8%'}
            ];
        }

        this.activeListItem = this.listItems[this.activeListItemIndex];
    }

    onChatKeydown(event) {
        if (event.key === 'Enter') {
            const message = event.currentTarget.value;
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];

            if (lastMessage.from) {
                this.chatMessages.push({ nth: false, from: 'Verona',
                    url: 'assets/layout/images/logo-' + (this.app.colorScheme === 'light' ? 'dark' : 'white') + '.png',
                    messages: [message] });
            }
            else {
                lastMessage.messages.push(message);
            }

            if (message.match(/primeng|primereact|primefaces|primevue/i)) {
                this.chatMessages.push({ nth: true, from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Always bet on Prime!'] });
            }

            event.currentTarget.value = '';

            const el = this.chatContainerViewChild.nativeElement;
            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1);
        }
    }
}
