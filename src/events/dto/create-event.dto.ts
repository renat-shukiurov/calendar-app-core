export class CreateEventDto {
    readonly date: string;
    readonly description: string;
    readonly authorId: number;
    readonly guestId: number;
}