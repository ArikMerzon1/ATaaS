import { AWSAppSyncClient } from "aws-appsync";
import { DocumentNode, ExecutableDefinitionNode, FieldNode } from "graphql";
import lCloneDeep from "lodash/cloneDeep";

export type CacheObject<T> = T & { __typename: string };
export type NormalizedCacheObject<T> = { [id: string]: Partial<CacheObject<T>> };

export default class Cache {
  static extractQueryName(query: DocumentNode): string {
    return ((query.definitions[0] as ExecutableDefinitionNode).selectionSet.selections[0] as FieldNode).name.value;
  }

  static updateList<T>(payload: {
    pk: string;
    pkValue: string;
    query: DocumentNode;
    variables: Record<string, unknown>;
    client: AWSAppSyncClient<NormalizedCacheObject<string>>;
    fn: (list: CacheObject<T>[], index: number) => CacheObject<T>[];
  }): void {
    const { pk, pkValue, query, variables = {}, fn, client } = payload;
    const queryName = Cache.extractQueryName(query);
    let result;
    try {
      result = client.cache.readQuery({ query, variables }) as {
        [key: string]: CacheObject<T>[];
      };
    } catch {
      /* this means there is no cache yet */
      return;
    }

    const oldList = result[queryName] as CacheObject<T>[];
    const index = oldList.findIndex((el: Record<string, unknown>) => el[pk] === pkValue);
    const updatedList = fn(lCloneDeep(oldList), index);

    client.cache.writeQuery({
      query,
      data: {
        [queryName]: updatedList,
      },
      variables,
    });
  }

  static setListItem<T>(payload: {
    pk: string;
    pkValue: string;
    query: DocumentNode;
    variables: Record<string, unknown>;
    client: AWSAppSyncClient<NormalizedCacheObject<string>>;
    item: CacheObject<T>;
  }): void {
    const fn = (list: CacheObject<T>[], index: number): CacheObject<T>[] => {
      list.splice(index > -1 ? index : 0, Number(index > -1), payload.item);
      return list;
    };

    Cache.updateList({
      ...payload,
      fn,
    });
  }

  static removeListItem<T>(payload: {
    pk: string;
    pkValue: string;
    query: DocumentNode;
    variables: Record<string, unknown>;
    client: AWSAppSyncClient<NormalizedCacheObject<string>>;
  }): void {
    const fn = (list: CacheObject<T>[], index: number): CacheObject<T>[] => list.splice(index, 1);

    Cache.updateList({
      ...payload,
      fn,
    });
  }
}
