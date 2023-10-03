import {DataSource, Repository} from "typeorm";
import {PlayersDto} from "../../dto/players";

export class PlayersService {
    dataSourceConfig: Promise<DataSource>;

    constructor(dataSourceConfig: Promise<DataSource>) {
        this.dataSourceConfig = dataSourceConfig;
    }

    // async createPlayers(request: any, response: any) {
    //     try {
    //         const dataSource: DataSource = await this.dataSourceConfig;
    //         const playerRepository: Repository<PlayersDto> = dataSource.getRepository(PlayersDto);
    //         let generateKey: string = Utils.createGameKeySession();
    //         const keyGame = await playerRepository.save(newUser);
    //         return response.status(201).json(keyGame);
    //     } catch (error) {
    //         return response.status(500).json({message: });
    //     }
    // }

    // async findGamekeyEsistant(generateKey: string): Promise<boolean> {
    //     try {
    //         const dataSource: DataSource = await this.dataSourceConfig;
    //         const gamekeyRepository: Repository<GamekeySessionDto> = dataSource.getRepository(GamekeySessionDto);
    //         let isExist = await gamekeyRepository.findBy({game_key_session: generateKey});
    //         return isExist.length > 0;
    //     } catch (error) {
    //         return false;
    //     }
    // }

}