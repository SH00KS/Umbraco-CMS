/**
* @description Utillity directives for key and field events
**/
angular.module('umbraco.directives')

.directive('onKeyup', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onKeyup);
            };
            elm.on("keyup", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onKeydown', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onKeydown);
            };
            elm.on("keydown", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onBlur', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onBlur);
            };
            elm.on("blur", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onFocus', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onFocus);
            };
            elm.on("focus", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onDragEnter', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onDragEnter);
            };
            elm.on("dragenter", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onDragLeave', function () {
    return function (scope, elm, attrs) {
        var f = function (event) {
            var rect = this.getBoundingClientRect();
            var getXY = function getCursorPosition(event) {
                var x, y;

                if (typeof event.clientX === 'undefined') {
                    // try touch screen
                    x = event.pageX + document.documentElement.scrollLeft;
                    y = event.pageY + document.documentElement.scrollTop;
                } else {
                    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }

                return { x: x, y : y };
            };

            var e = getXY(event.originalEvent);

            // Check the mouseEvent coordinates are outside of the rectangle
            if (e.x > rect.left + rect.width - 1 || e.x < rect.left || e.y > rect.top + rect.height - 1 || e.y < rect.top) {
                scope.$apply(attrs.onDragLeave);
            }
        };

        elm.on("dragleave", f);
        scope.$on("$destroy", function(){ elm.off(f);} );
    };
})

.directive('onDragOver', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onDragOver);
            };
            elm.on("dragover", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onDragStart', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onDragStart);
            };
            elm.on("dragstart", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onDragEnd', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onDragEnd);
            };
            elm.on("dragend", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onDrop', function () {
    return {
        link: function (scope, elm, attrs) {
            var f = function () {
                scope.$apply(attrs.onDrop);
            };
            elm.on("drop", f);
            scope.$on("$destroy", function(){ elm.off(f);} );
        }
    };
})

.directive('onOutsideClick', function ($timeout) {
    return function (scope, element, attrs) {
        
        function oneTimeClick(event) {
                var el = event.target.nodeName;
                //ignore link and button clicks
                var els = ["INPUT","A","BUTTON"];
                if(els.indexOf(el) >= 0){return;}

                //ignore children of links and buttons
                var parents = $(event.target).parents("a,button");
                if(parents.length > 0){
                    return;
                }
                
                //ignore clicks inside this element
                if( $(element).has( $(event.target) ).length > 0 ){
                    return;
                } 

                scope.$apply(attrs.onOutsideClick);
        }

        $timeout(function(){
            $(document).on("click", oneTimeClick);

            scope.$on("$destroy", function() {
                $(document).off("click", oneTimeClick);
            }); 
        }); // Temp removal of 1 sec timeout to prevent bug where overlay does not open. We need to find a better solution.

    };
})

.directive('onRightClick',function(){
    
    document.oncontextmenu = function (e) {
       if(e.target.hasAttribute('on-right-click')) {
           e.preventDefault();
           e.stopPropagation(); 
           return false;
       }
    };  

    return function(scope,el,attrs){
        el.on('contextmenu',function(e){
            e.preventDefault();
            e.stopPropagation();
            scope.$apply(attrs.onRightClick);
            return false;
        });
    };
})

.directive('onDelayedMouseleave', function ($timeout, $parse) {
        return {

            restrict: 'A',
            
            link: function (scope, element, attrs, ctrl) {
                var active = false;
                var fn = $parse(attrs.delayedMouseleave);

                var leave_f = function(event) {
                    var callback = function() {
                        fn(scope, {$event:event});
                    };

                    active = false;
                    $timeout(function(){
                        if(active === false){
                            scope.$apply(callback);
                        }
                    }, 650);
                };

                var enter_f = function(event, args){
                    active = true;
                };


                element.on("mouseleave", leave_f);
                element.on("mouseenter", enter_f);

                //unsub events
                scope.$on("$destroy", function(){
                    element.off(leave_f);
                    element.off(enter_f);
                });
            }
        };
    });