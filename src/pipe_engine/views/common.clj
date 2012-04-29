(ns pipe-engine.views.common
  (:require
   [clojure.repl]
   [noir.response :as res]
   [pipe-engine.models.functions :as fun])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(defpage "/" []
  (res/redirect "/index.html"))

(defpage [:put "/run"] {:keys [req]}
  (res/json {:error "not implement" :req req} ))


(defpage "/functions" []
  (res/json fun/list-functions))

