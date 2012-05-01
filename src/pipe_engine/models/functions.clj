(ns pipe-engine.models.functions
  (:require [ clojure.repl :as repl]
            [grotesql.functions]
            [grotesql.input]
            [grotesql.multi-input]
            [grotesql.output]))



(defn export-function  [fun]
  (let [r (resolve fun) m (meta r)]
    {:name (str (:name m))
     :ns (str (:ns  m))
     :file (:file m)
     :source (repl/source-fn fun) 
     :doc (:doc m)
     :parameters (:parameters m)
     :connections (:connections m)}))

(def function-list '(grotesql.input/input-csv
                     grotesql.multi-input/simple-join
                     grotesql.functions/drop-columns
                     grotesql.functions/str-columns
                     grotesql.output/output-csv))

(def list-functions (map export-function function-list))
