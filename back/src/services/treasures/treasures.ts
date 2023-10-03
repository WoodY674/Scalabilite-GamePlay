import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('treasures')
export class TreasuresDto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'pos_x' })
    posX: number;

    @Column({ name: 'pos_y' })
    posY: number;

    @Column({ name: 'is_claim' })
    isClaim: boolean = false;
}