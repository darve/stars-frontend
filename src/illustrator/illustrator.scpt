on run argv
     tell application "Adobe Illustrator"
          
          -- Call the javascript with the arguments provided
          do javascript "#include ~/Sites/stars/src/illustrator/parse.jsx" with arguments { item 1 of argv, item 2 of argv }

     end tell
end run