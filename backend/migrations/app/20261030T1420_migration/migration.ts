#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4a0c89934834e5e6fe1ea10396cbf6b146002c3b3da77c6450edf415dc11ed4e/contract';
import endContract from '../../snapshots/4a0c89934834e5e6fe1ea10396cbf6b146002c3b3da77c6450edf415dc11ed4e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  createCollection,
  createIndex,
} from '@prisma/orm-mongo/target/migration';

class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      createCollection('events', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              rating: { bsonType: ['null', 'int'] },
              title: { bsonType: 'string' },
            },
            required: ['_id', 'title'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('memories', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              authorId: { bsonType: 'objectId' },
              createdAt: { bsonType: 'date' },
              date: { bsonType: 'date' },
              events: { bsonType: ['null', 'string'] },
              note: { bsonType: ['null', 'string'] },
              rating: { bsonType: 'int' },
              title: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' },
            },
            required: ['_id', 'authorId', 'createdAt', 'date', 'rating', 'title', 'updatedAt'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('users', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              createdAt: { bsonType: 'date' },
              displayName: { bsonType: ['null', 'string'] },
              password: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' },
              userType: { bsonType: 'string', enum: ['GOOGLE', 'USERNAME'] },
              username: { bsonType: 'string' },
            },
            required: ['_id', 'createdAt', 'password', 'updatedAt', 'userType', 'username'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createIndex('users', [{ direction: 1, field: 'username' }], { unique: true }),
    ];
  }
}

export default M;
MigrationCLI.run(import.meta.url, M);
