(ns pipe-engine.views.welcome
  (:require [pipe-engine.views.common :as common]
  [noir.response :as res])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(defpage "/" []
         (res/redirect "/index.html"))
