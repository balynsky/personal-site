---
title: "How to Organize Secure Data Storage with Three-Layer Encryption"
layout: post
date: 2026-03-12 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Security
- Encryption
- Cloud
category: blog
author: balynsky
sitemap: false
description: Implementing a three-layer encryption architecture for secure cloud data storage
---
#### Introduction

Security of stored and transmitted data is a top priority for any cloud platform. In this article, I want to share how I organized encryption of objects within a multi-cloud platform deployed across AWS, GCP, and Azure.

Encryption is a core part of the platform's security strategy. It adds a layer of data protection and ensures that if objects accidentally fall into the hands of an attacker, they cannot access the data without also having access to the encryption keys.

The platform uses AWS S3, Google Cloud Storage (GCS), and Azure Blob for storing customer objects, with an option for individual customers to store data in their own buckets (with a compatible API). Regardless of the chosen storage option, the platform ensures all objects are stored in encrypted form without any action required from the customer, using robust encryption mechanisms.

#### Encryption Flow

Storing and encrypting data requires using multiple layers of keys for the encrypted data. This approach is known as [envelope encryption](https://cloud.google.com/kms/docs/envelope-encryption) — the same pattern Google uses for its own [default encryption at rest](https://cloud.google.com/docs/security/encryption/default-encryption).

The platform uses the Advanced Encryption Standard (AES) algorithm to encrypt data. All data is encrypted with AES-256, which is recommended by the National Institute of Standards and Technology (NIST) for long-term storage. AES-256 can also be included as part of customer compliance requirements. The cryptographic library used is [Bouncy Castle](https://www.bouncycastle.org/), which holds a [NIST certificate](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/3585).

The encryption architecture relies on three layers of keys:

**Layer 1 — Data Encryption Key (DEK).** The key used to encrypt the actual data (files, emails, calendar events, or contacts). Due to the need for low latency and high availability, these keys are stored close to the data they encrypt. DEKs are encrypted ("wrapped") by the next layer.

**Layer 2 — Key Encryption Key (KEK).** A unique KEK is created for each customer account. It is used exclusively by that single account and cannot be reused. KEK management is handled by a centralized key management service, which makes DEK storage and encryption manageable while also enabling access tracking and control.

**Layer 3 — Master Encryption Key (MEK).** The KEK is in turn wrapped by a product-level master key, unique per cloud provider. This key is stored in a specialized provider service that is validated against the [FIPS 140-2](https://cloud.google.com/security/compliance/fips-140-2-validated) standard. For example, on AWS this is AWS Key Management Service (KMS), which uses hardware security modules (HSMs). On GCP, Google Cloud KMS provides equivalent guarantees with FIPS 140-2 Level 1 validated software keys and Level 3 certified HSMs.

#### Backup Encryption Example

To illustrate the process, let's walk through how content is encrypted during a backup operation:

**Init phase:**
1. Retrieve MEK from AWS KMS (or the respective provider's KMS)
2. Retrieve KEK from the distribution database and decrypt it using MEK
3. Erase MEK from the worker

**Backup:**
1. Generate a new DEK
2. Pull the item and encrypt it using DEK
3. Store the encrypted object on the worker
4. Encrypt (wrap) DEK using KEK
5. Generate object metadata
6. Move the encrypted object with metadata to cloud storage

**Finalization:**
1. Erase KEK from the worker

The diagram below illustrates the overall encryption architecture and data flow:

![Encryption Process][1]{: style="width:780px"}

Notice that the MEK is erased from the worker as soon as the KEK is decrypted, and the KEK is erased once the backup is complete. At no point do all three key layers exist on the worker simultaneously, minimizing the attack surface.

#### Key Rotation

One of the most critical aspects of the system is key rotation — the processes and procedures for rotating MEK and KEK keys. Rotation can be automatically initiated when the current key's expiration date is reached. Each key type has its own expiration period.

The platform stores a reference to only one active key per account, but in reality, data is protected by a set of keys: one active key for encryption and a set of historical keys for decryption. After 5 years of storage, mandatory re-encryption is performed to limit the length of the historical key chain. In practice, however, customer data is governed by a retention policy and is typically removed from the platform before that deadline.

#### References

- [Google Cloud — Default Encryption at Rest](https://cloud.google.com/docs/security/encryption/default-encryption)
- [Google Cloud — Envelope Encryption](https://cloud.google.com/kms/docs/envelope-encryption)
- [Google Cloud — FIPS 140-2 Validated](https://cloud.google.com/security/compliance/fips-140-2-validated)
- [Bouncy Castle NIST Certificate #3585](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/3585)

[1]: /assets/images/posts/2026-03-12/1.svg
