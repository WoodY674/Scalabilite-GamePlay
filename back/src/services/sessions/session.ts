import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('sessions')
export class SessionDto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'background_img' })
    backgroundImg: string;

    @Column({ name: 'scale_x' })
    scaleX: number;

    @Column({ name: 'scale_y' })
    scaleY: number;

    @Column({ name: 'is_session_open' })
    isSessionOpen: boolean;
}