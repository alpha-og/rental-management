import {
    AllowNull,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

interface AttachmentAttributes {
    id: string;
    productId: string;
    url: string;
    mimeType?: string;
}

type AttachmentCreationAttributes = Omit<AttachmentAttributes, "id">;

@Table({ tableName: "attachments", timestamps: true })
export class Attachment extends Model<
    AttachmentAttributes,
    AttachmentCreationAttributes
> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare url: string;

    @Column(DataType.UUID)
    declare productId: string;
}
