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
    appwriteFileId: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
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
    declare appwriteFileId: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare fileName: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare mimeType: string;

    @AllowNull(false)
    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    declare fileSize: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare fileUrl: string;

    @Column(DataType.UUID)
    declare productId: string;
}
