import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Time: any;
  /** The `Long` scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};








export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new document in the collection of 'Stream' */
  createStream: Stream;
  /** Update an existing document in the collection of 'Stream' */
  updateStream?: Maybe<Stream>;
  /** Delete an existing document in the collection of 'Stream' */
  deleteStream?: Maybe<Stream>;
  /** Partially updates an existing document in the collection of 'Stream'. It only modifies the values that are specified in the arguments. During execution, it verifies that required fields are not set to 'null'. */
  partialUpdateStream?: Maybe<Stream>;
};


export type MutationCreateStreamArgs = {
  data: StreamInput;
};


export type MutationUpdateStreamArgs = {
  id: Scalars['ID'];
  data: StreamInput;
};


export type MutationDeleteStreamArgs = {
  id: Scalars['ID'];
};


export type MutationPartialUpdateStreamArgs = {
  id: Scalars['ID'];
  data: PartialUpdateStreamInput;
};

/** 'Stream' input values */
export type PartialUpdateStreamInput = {
  service?: Maybe<EnumService>;
  title?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  viewers?: Maybe<Scalars['Int']>;
  startedAt?: Maybe<Scalars['Time']>;
  link?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  tech?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** 'Stream' input values */
export type StreamInput = {
  service: EnumService;
  title: Scalars['String'];
  channel: Scalars['String'];
  thumbnail: Scalars['String'];
  viewers: Scalars['Int'];
  startedAt: Scalars['Time'];
  link: Scalars['String'];
  language: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  tech?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** The pagination object for elements of type 'Stream'. */
export type StreamPage = {
  __typename?: 'StreamPage';
  /** The elements of type 'Stream' in this page. */
  data: Array<Maybe<Stream>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};

export enum EnumOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export enum EnumService {
  Twitch = 'twitch',
  Youtube = 'youtube'
}

export enum EnumSorting {
  Viewers = 'viewers',
  StartedAt = 'startedAt'
}

export type Filter = {
  language?: Maybe<Scalars['String']>;
  service?: Maybe<EnumService>;
  tech?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Query = {
  __typename?: 'Query';
  /** Find a document from the collection of 'Stream' by its id. */
  findStreamByID?: Maybe<Stream>;
  allStreams: QueryAllStreamsPage;
};


export type QueryFindStreamByIdArgs = {
  id: Scalars['ID'];
};


export type QueryAllStreamsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
  sorting?: Maybe<EnumSorting>;
  order?: Maybe<EnumOrder>;
  filter?: Maybe<Filter>;
};

/** The pagination object for elements of type 'Stream'. */
export type QueryAllStreamsPage = {
  __typename?: 'QueryAllStreamsPage';
  /** The elements of type 'Stream' in this page. */
  data: Array<Maybe<Stream>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};

export type Stream = {
  __typename?: 'Stream';
  channel: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  /** The document's ID. */
  _id: Scalars['ID'];
  viewers: Scalars['Int'];
  service: EnumService;
  thumbnail: Scalars['String'];
  language: Scalars['String'];
  link: Scalars['String'];
  startedAt: Scalars['Time'];
  tech?: Maybe<Array<Maybe<Scalars['String']>>>;
  title: Scalars['String'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};



export type AllStreamsQueryVariables = Exact<{
  sorting?: Maybe<EnumSorting>;
  order?: Maybe<EnumOrder>;
  filter?: Maybe<Filter>;
  size?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
}>;


export type AllStreamsQuery = (
  { __typename?: 'Query' }
  & { allStreams: (
    { __typename?: 'QueryAllStreamsPage' }
    & Pick<QueryAllStreamsPage, 'after' | 'before'>
    & { data: Array<Maybe<(
      { __typename?: 'Stream' }
      & Pick<Stream, 'service' | 'title' | 'thumbnail' | 'viewers' | 'startedAt' | 'link' | 'channel' | 'avatar' | 'language'>
    )>> }
  ) }
);


export const AllStreamsDocument = gql`
    query allStreams($sorting: EnumSorting, $order: EnumOrder, $filter: Filter, $size: Int, $cursor: String) {
  allStreams(
    sorting: $sorting
    order: $order
    filter: $filter
    _size: $size
    _cursor: $cursor
  ) {
    after
    before
    data {
      service
      title
      thumbnail
      viewers
      startedAt
      link
      channel
      avatar
      language
    }
  }
}
    `;

export function useAllStreamsQuery(options: Omit<Urql.UseQueryArgs<AllStreamsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllStreamsQuery>({ query: AllStreamsDocument, ...options });
};