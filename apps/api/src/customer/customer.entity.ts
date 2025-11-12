import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("customers")
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 12 })
  code: string;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column()
  email: string;

  @Column({ length: 15 })
  phoneNumber: string;

  @Column()
  shippingAddress: string;

  @Column()
  billingAddress: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
  deletedAt: Date | null;
}
