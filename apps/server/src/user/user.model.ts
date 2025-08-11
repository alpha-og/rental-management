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
    username: string;
    passwordHash: string;
    refreshToken?: string;
}

type UserCreationAttributes = Omit<UserAttributes, "id">;

@Table({
    tableName: "users",
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
    declare username: string;

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
