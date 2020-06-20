import { Component, Vue } from "vue-property-decorator";
import { debounce } from 'lodash';

interface Package {
    name: string;
    author: string;
    date: string;
}

@Component
export default class TestCmp extends Vue {

    private url = 'https://data.jsdelivr.com/v1';
    private searchUrl = 'http://registry.npmjs.com/-/v1/search'
    private page = 1;
    private limit = 10;

    public packages: Package[] = [];
    public packagesRaw = [];
    public searchPackage = null;
    public numberOfPages = 0;
    public aNumberOfPages: number[] = [];

    public modalTitle = '';
    public activePackage: Package | null = null;
    public activePackageRaw = null;

    public isLoading = false;

    get search() {
        return debounce(_ => {
            this.getData();
        }, 1000);
    }

    public showModal(index: number) {
        this.activePackage = this.packages[index];
        this.activePackageRaw = this.packagesRaw[index];
        this.modalTitle = `Пакет ${this.activePackage.name}`;
        this.$bvModal.show('modal');
    }

    clearData() {
        this.numberOfPages = 0;
        this.aNumberOfPages = [];
        this.packages = [];
        this.packagesRaw = [];
    }

    getData() {
        this.isLoading = true;
        Vue.axios.get(`${this.searchUrl}?text=${this.searchPackage}&size=${this.limit}&from=${(this.page - 1) * this.limit}`).then((response) => {
            this.clearData();

            if (Array.isArray(response.data.objects)) {
                this.packages = (response.data.objects as Array<any>).map((i: any) => {
                    return {
                        name: i.package && i.package.name || '',
                        author: i.package && i.package.author && i.package.author.name || '',
                        date: i.package && i.package.date || ''
                    };
                });
                this.packagesRaw = response.data.objects;
            }
            const pages = response.data.total /= this.limit;
            const ost = response.data.total % this.limit;
            if (ost !== 0) {
                this.numberOfPages = Math.ceil(pages);
            } else {
                this.numberOfPages = Math.floor(pages);
            }
            for (let i = 0; i < this.numberOfPages; i++) {
                this.aNumberOfPages[i] = i + 1;
            }

            this.isLoading = false;
        }).catch(error => {
            console.dir(error);
            if (error.message) {
                this.$bvToast.toast(error.message, {
                    title: 'Ошибка',
                    variant: 'danger'
                });
            }
            if (error.status === 401) {
                console.error('Unauthorized!!!');
            }
        });
    }

    firstPage() {
        this.page = 1;
        this.getData();
    };
    prevPage() {
        if (this.page > 1) {
            this.page--;
        } else {
            this.page = 1;
        }
        this.getData();
    };
    goToPage(pageNumb: number) {
        this.page = Number(pageNumb);
        this.getData();
    };
    nextPage() {
        if (this.page < this.numberOfPages) {
            this.page++;
        } else {
            this.page = this.numberOfPages;
        }
        this.getData();
    };
    lastPage() {
        this.page = this.numberOfPages;
        this.getData();
    }

    performDate(date: Date) {
        return (new Date(date)).toLocaleDateString()
    }

}