#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4a0c89934834e5e6fe1ea10396cbf6b146002c3b3da77c6450edf415dc11ed4e/contract';
import startContract from '../../snapshots/4a0c89934834e5e6fe1ea10396cbf6b146002c3b3da77c6450edf415dc11ed4e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b44ebc17a358117d2bcf64ecadc0c7b8bec5040952a3e610c4dc1bfc59dbeafe/contract';
import endContract from '../../snapshots/b44ebc17a358117d2bcf64ecadc0c7b8bec5040952a3e610c4dc1bfc59dbeafe/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, collMod, unsetField } from '@prisma/orm-mongo/target/migration';

class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      unsetField('memories', 'events'),
      collMod(
        'events',
        {
          validator: {
            $jsonSchema: {
              additionalProperties: false,
              bsonType: 'object',
              properties: {
                _id: { bsonType: 'objectId' },
                memoryId: { bsonType: 'objectId' },
                rating: { bsonType: ['null', 'int'] },
                title: { bsonType: 'string' },
              },
              required: ['_id', 'memoryId', 'title'],
            },
          },
          validationLevel: 'strict',
          validationAction: 'error',
        },
        {
          id: 'validator.events.update',
          label: 'Update validator on events (added: memoryId)',
          operationClass: 'widening',
        },
      ),
      collMod(
        'memories',
        {
          validator: {
            $jsonSchema: {
              additionalProperties: false,
              bsonType: 'object',
              properties: {
                _id: { bsonType: 'objectId' },
                authorId: { bsonType: 'objectId' },
                createdAt: { bsonType: 'date' },
                date: { bsonType: 'date' },
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
        },
        {
          id: 'validator.memories.update',
          label: 'Update validator on memories (removed: events)',
          operationClass: 'widening',
        },
      ),
      collMod(
        'users',
        {
          validator: {
            $jsonSchema: {
              additionalProperties: false,
              bsonType: 'object',
              properties: {
                _id: { bsonType: 'objectId' },
                createdAt: { bsonType: 'date' },
                displayName: { bsonType: ['null', 'string'] },
                githubId: { bsonType: ['null', 'string'] },
                googleId: { bsonType: ['null', 'string'] },
                password: { bsonType: ['null', 'string'] },
                passwordVersion: { bsonType: 'int' },
                updatedAt: { bsonType: 'date' },
                userType: { bsonType: 'string', enum: ['GOOGLE', 'USERNAME', 'GITHUB'] },
                username: { bsonType: 'string' },
              },
              required: [
                '_id',
                'createdAt',
                'passwordVersion',
                'updatedAt',
                'userType',
                'username',
              ],
            },
          },
          validationLevel: 'strict',
          validationAction: 'error',
        },
        {
          id: 'validator.users.update',
          label:
            'Update validator on users (changed: password, userType; added: githubId, googleId, passwordVersion)',
          operationClass: 'widening',
        },
      ),
    ];
  }
}

export default M;
MigrationCLI.run(import.meta.url, M);
