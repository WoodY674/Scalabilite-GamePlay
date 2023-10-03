import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('players')
export class PlayersDto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    avatar: string;

    @CreateDateColumn({ name: 'pos_x' })
    posX: number;

    @CreateDateColumn({ name: 'pos_y' })
    posY: number;


}