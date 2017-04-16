export class Hero {
    id: number;
    name: string;
    description: string;
    thumbnail: { path: string, extension: string };
    rating?: number;
    isFavorite?: boolean;

    constructor(rawHero: any) {
        this.id = +rawHero.id || +rawHero.$key;
        this.name = rawHero.name;
        this.description = rawHero.description;
        this.thumbnail = rawHero.thumbnail;
    }

    get smallThumbnail(): string {
        return `${this.thumbnail.path}/standard_small.${this.thumbnail.extension}`;
    }

    get bigThumbnail(): string {
        return `${this.thumbnail.path}/portrait_uncanny.${this.thumbnail.extension}`;
    }
}
