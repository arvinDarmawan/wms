import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("warehouses")
export class WarehouseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8 })
  code: string;

  @Column({ length: 30 })
  name: string;

  @Column()
  address: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
  deletedAt: Date | null;
}
