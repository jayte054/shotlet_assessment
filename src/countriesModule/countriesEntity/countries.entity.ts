import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CountryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

@Entity()
export class GetCountryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  language: string;
  @Column()
  population: number;
  @Column('text', { array: true })
  borders: string[];
  @Column()
  area: number;
}
