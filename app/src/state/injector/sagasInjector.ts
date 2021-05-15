/**
 * Based on: https://github.com/GuillaumeCisco/redux-sagas-injector
 * "Forked" because of issues with esbuild and jest
 */

// @ts-nocheck
// TODO: define types

import { Saga } from "@redux-saga/types";
import { Store } from "redux";
import createSagaMiddleware from "redux-saga";
import { take, fork, cancel } from "redux-saga/effects";

import { createInjectStore } from "./reducersInjector";

export const CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR";

let original_store: Store;

function createAbortableSaga(key: string, saga: Saga): any {
  if (process.env.NODE_ENV === "development") {
    return function* main() {
      const sagaTask = yield fork(saga);
      const { payload } = yield take(CANCEL_SAGAS_HMR);

      if (payload === key) {
        yield cancel(sagaTask);
      }
    };
  } else {
    return saga;
  }
}

export const sagaMiddleware = createSagaMiddleware();

export const SagaManager = {
  startSaga(key: string, saga: Saga) {
    sagaMiddleware.run(createAbortableSaga(key, saga));
  },

  cancelSaga(key: string, store = original_store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
      payload: key,
    });
  },
};

export function reloadSaga(key, saga, store = original_store) {
  SagaManager.cancelSaga(key, store);
  SagaManager.startSaga(key, saga);
}

export function injectSaga(key, saga, force = false, store = original_store) {
  // If already set, do nothing, except force is specified
  const exists = store.injectedSagas.includes(key);
  if (!exists || force) {
    if (!exists) {
      store.injectedSagas = [...store.injectedSagas, key];
    }
    if (force) {
      SagaManager.cancelSaga(key, store);
    }
    SagaManager.startSaga(key, saga);
  }
}

export function injectSagaBulk(sagas, force = false, store = original_store) {
  sagas.forEach((x) => {
    // If already set, do nothing, except force is specified
    const exists = store.injectedSagas.includes(x.key);
    if (!exists || force) {
      if (!exists) {
        store.injectedSagas = [...store.injectedSagas, x.key];
      }
      if (force) {
        SagaManager.cancelSaga(x.key, store);
      }
      SagaManager.startSaga(x.key, x.saga);
    }
  });
}

export function createInjectSagasStore(
  rootSaga: Saga,
  initialReducers,
  ...args
): Store {
  original_store = createInjectStore(initialReducers, ...args);
  original_store.injectedSagas = [];

  injectSaga("rootSaga", rootSaga, false, original_store);

  return original_store;
}

export default createInjectSagasStore;
