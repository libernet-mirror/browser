// Original file: proto/libernet.proto

import type { NodeIdentity as _libernet_NodeIdentity, NodeIdentity__Output as _libernet_NodeIdentity__Output } from '../libernet/NodeIdentity';

export interface _libernet_NetworkTopology_Cluster {
  'node'?: (_libernet_NodeIdentity)[];
}

export interface _libernet_NetworkTopology_Cluster__Output {
  'node'?: (_libernet_NodeIdentity__Output)[];
}

export interface NetworkTopology {
  'cluster'?: (_libernet_NetworkTopology_Cluster)[];
}

export interface NetworkTopology__Output {
  'cluster'?: (_libernet_NetworkTopology_Cluster__Output)[];
}
