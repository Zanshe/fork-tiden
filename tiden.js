import announce from "./lib/api/announce.js"
import cache from "./lib/api/cache.js"
import connect from "./lib/api/connect.js"
import linkTo from "./lib/api/linkTo.js"
import listenFor from "./lib/api/listenFor.js"
import merge from "./lib/api/merge.js"
import mutex from "./lib/api/mutex.js"
import once from "./lib/api/once.js"
import request from "./lib/api/request.js"
import respondTo from "./lib/api/respondTo.js"
import respondToSync from "./lib/api/respondToSync.js"
import simpleStream from "./lib/api/simpleStream.js"
import waitFor from "./lib/api/waitFor.js"
import whenChanged from "./lib/api/whenChanged.js"

export { announce, cache, connect, linkTo, listenFor, merge, mutex, once, request, respondTo, respondToSync, simpleStream, waitFor, whenChanged }

import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"

let sagaMiddleware

export default function tiden(actor) {
  if (sagaMiddleware) {
    sagaMiddleware.run(actor)
    return {
      sagaMiddleware,
    }
  }

  const ret = {}

  sagaMiddleware = createSagaMiddleware({
    onError: (e, { sagaStack }) => {
      sagaMiddleware.run(function*() {
        yield announce(`error`, {data: e, stack: sagaStack})
      })
    },
  })
  const store = createStore((s) => s || {})
  sagaMiddleware.run(actor)

  return {
    sagaMiddleware,
  }
}
