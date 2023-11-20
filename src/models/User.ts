import bcrypt from "bcrypt";
import generateId from "../utils/generateId";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";


@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: "varchar" })
  name: string;

  @Column({ nullable: false, type: "varchar" })
  lastName: string;

  @Column({ nullable: false, type: "varchar" })
  email: string;

  @Column({ nullable: false, type: "varchar" })
  password: string;

  @Column({ nullable: false, type: "varchar" })
  username: string;

  @Column({ nullable: false, type: "varchar", default: 1 })
  token: string;

  @Column({ default: true, type: "boolean" })
  confirmed: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      const saltRounds = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  validatePassword = async function (this: User, passwordFormulario: string) {
    return await bcrypt.compare(passwordFormulario, this.password);
  };
}

export default User;