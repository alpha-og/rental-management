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

// ✅ Add creation interface (excludes auto-generated fields)
// interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}
type UserCreationAttributes = Omit<UserAttributes, "id">;

@Table({
    tableName: "users", // ✅ Explicit table name
    timestamps: true, // ✅ Adds createdAt/updatedAt
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID) // ✅ Simplified - no redundant options
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
        type: DataType.TEXT, // ✅ Changed to TEXT for longer tokens
        allowNull: true,
    })
    declare refreshToken?: string;
}
