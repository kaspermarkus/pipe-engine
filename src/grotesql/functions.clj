(ns grotesql.functions)

(defn drop-columns
  "Takes [keys] and a table and drops the columns that has the names of the keys"
  {:parameters
   {:keys {:type "array" :details {:type "column-header"} }
    :table {:type "table"}}
   :connections [1 1]}
  [ keys table ]
  (map (fn [row] (apply dissoc row keys )) table ))

; TODO/FIXME: 
; * Make sure that we do not supply a key already in use (newkey cannot be a key used in table)
; * newkey has to be a symbol
(defn str-columns
  "Takes a table and three keys. For each row, the values with the two keys are merged into a new column with the new keyname"
  {:parameters
   {:key1 [ :type "column-header"]
    :key2 {:type "column-header"}
    :separator {:type "string"}
    :table {:type "table"}}
   :connections [0 1]}
  
  [ key1 key2 newkey separator table ]
  (map (fn [row] 
         (merge {newkey (str (get row key1) separator (get row key2))} row)) table))