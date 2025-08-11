import {
    Column,
    Model,
    PrimaryKey,
    Table,
    DataType,
    Default,
    Unique,
    AllowNull,
} from "sequelize-typescript";

interface UserAttributes {
    id: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    refreshToken?: string;
}

type UserCreationAttributes = Omit<UserAttributes, "id">;

@Table({
    timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    declare email: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    declare phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare passwordHash: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare refreshToken?: string;
}
