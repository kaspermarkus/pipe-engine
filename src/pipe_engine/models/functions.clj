(ns pipe-engine.models.functions
  (:require [ clojure.repl :as repl]
            [ grotesql.functions :as f])
  )

(defn export-function  [fun]
  {:name (str fun)
   :source (repl/source-fn fun)
   :doc (:doc (meta (resolve fun)))})

(def function-list ['f/drop-columns 'f/str-columns 'count])
(def list-functions (map export-function function-list))