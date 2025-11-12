import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("uoms")
export class UomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8 })
  code: string;

  @Column({ length: 15 })
  name: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
  deletedAt: Date | null;
}
