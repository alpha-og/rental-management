import {
    AllowNull,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

interface ContractAttributes {
    id: string;
    orderId: string;
    rentalPeriod: string; // ISO 8601 duration or custom format
    startDate: Date;
}

type ContractCreationAttributes = Omit<ContractAttributes, "id">;

@Table({ tableName: "contracts", timestamps: true })
export class Contract extends Model<
    ContractAttributes,
    ContractCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare rentalPeriod: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    declare startDate: Date;

    @Column(DataType.UUID)
    declare orderId: string;
}
