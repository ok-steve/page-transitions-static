(function (Stimulus, Turbolinks, TweenMax, TimelineMax, Sine, morphdom, mapboxgl) {
  'use strict';

  /**
   * Variables
   */

  var application,
    NavigationController,
    MenuDrawerController,
    MapController,
    PlaceController,
    FollowController;

  /**
   * Utilities
   */

  function classExtends(Parent) {
    var Child = function () {
      Parent.apply(this, arguments);
    }

    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;

    Object.keys(Parent).forEach(function (key) {
      Child[key] = Parent[key];
    });

    return Child;
  }


  /**
   * Controllers
   */

  /* Navigation controller */

  NavigationController = classExtends(Stimulus.Controller);

  Object.defineProperties(NavigationController.prototype, {
    drawerController: {
      get: function () {
        return this.application.getControllerForElementAndIdentifier(this.menuDrawerTarget, 'drawer');
      },
    },
    menuOpened: {
      get: function () {
        return this.drawerController.menuOpened;
      },
    },
  });

  NavigationController.prototype.connect = function () {
    this.closeMenu();
  };

  NavigationController.prototype.openMenu = function () {
    TweenMax.to('.first', 0.2, {
      x: 18,
      ease: Sine.easeOut
    })
    TweenMax.to('.last', 0.2, {
      x: -18,
      ease: Sine.easeOut
    })
    TweenMax.staggerTo(
      '.first, .middle, .last',
      0.2,
      {
        fill: '#7eebe6',
        ease: Sine.easeOut
      },
      0.04
    )

    this.drawerController.enter();
  };

  NavigationController.prototype.closeMenu = function () {
    TweenMax.to('.first', 0.2, {
      x: 0,
      ease: Sine.easeIn
    })
    TweenMax.to('.last', 0.2, {
      x: 0,
      ease: Sine.easeIn
    })
    TweenMax.to('.first, .middle, .last', 0.2, {
      fill: '#fff'
    })

    this.drawerController.beforeEnter();
  };

  NavigationController.prototype.toggleMenu = function () {
    this.menuOpened ? this.closeMenu() : this.openMenu();
  };

  NavigationController.targets = [
    'menuDrawer',
  ];

  /* Menu drawer controller */

  MenuDrawerController = classExtends(Stimulus.Controller);

  Object.defineProperties(MenuDrawerController.prototype, {
    menuOpened: {
      get: function () {
        return this.element.classList.contains('is-open');
      },
    },
  });

  MenuDrawerController.prototype.beforeEnter = function () {
    var el = this.element;

    TweenMax.set(el, {
      opacity: 0,
      scale: 0,
      transformOrigin: '100% 0%'
    })
    TweenMax.set(el.childNodes, {
      opacity: 0
    })

    this.element.classList.remove('is-open');
  };

  MenuDrawerController.prototype.enter = function () {
    var el = this.element;

    TweenMax.fromTo(
      el,
      0.2,
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        ease: Sine.easeOut
      }
    )
    TweenMax.staggerFromTo(
      el.childNodes,
      0.45,
      {
        opacity: 0
      },
      {
        delay: 0.1,
        opacity: 1,
        ease: Sine.easeOut
      },
      0.04
    )

    this.element.classList.add('is-open');
  };

  MenuDrawerController.prototype.toggleMenu = function () {
    this.menuOpened ? this.beforeEnter() : this.enter();
  };

  /* Map controller */

  MapController = classExtends(Stimulus.Controller);

  MapController.prototype.connect = function () {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2RyYXNuZXIiLCJhIjoiY2pmZzBqZmptMjI1eTMzbWl1bGExMHppZyJ9.diPXryPOiyMuqcV4mpNOlg'

    var map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/sdrasner/cjfg0watl6rkv2sllf6hepdd5'
    })
  };

  /* Place controller */

  PlaceController = classExtends(Stimulus.Controller);

  Object.defineProperties(PlaceController.prototype, {
    saved: {
      get: function () {
        return this.element.classList.contains('is-saved');
      },
      set: function (val) {
        this.element.classList.toggle('is-saved', val);
      }
    },
  });

  PlaceController.prototype.addPlace = function () {
    if (!this.saved) {
      this.addAnimation()
      this.saved = true
    } else {
      this.removeAnimation()
      this.saved = false
    }
  };

  PlaceController.prototype.addAnimation = function () {
    //I love prettier, but it does make this animation code a lot longer and less legible than it could be :/
    var tl = new TimelineMax()

    tl.add('start')
    tl.to(
      '.plus',
      0.75,
      {
        rotation: -360,
        transformOrigin: '50% 50%',
        ease: Expo.easeOut
      },
      'start'
    )
    tl.to(
      '.line2',
      0.7,
      {
        scaleY: 0.5,
        x: -2,
        rotation: -45,
        transformOrigin: '50% 100%',
        ease: Expo.easeOut
      },
      'start'
    )
    tl.to(
      '.line1',
      0.7,
      {
        rotation: -50,
        x: 7,
        scaleX: 3,
        transformOrigin: '50% 100%',
        ease: Expo.easeOut
      },
      'start'
    )
    tl.fromTo(
      '.saveinfo',
      0.5,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        ease: Sine.easeOut
      },
      'start'
    )
    tl.to(
      '.saveinfo',
      0.4,
      {
        autoAlpha: 0,
        ease: Expo.easeIn
      },
      'start+=1'
    )

    return tl
  };

  PlaceController.prototype.removeAnimation = function () {
    var tl = new TimelineMax()

    tl.add('begin')
    tl.to(
      '.plus',
      0.75,
      {
        rotation: 0,
        transformOrigin: '50% 50%',
        ease: Expo.easeOut
      },
      'begin'
    )
    tl.to(
      '.line2',
      0.7,
      {
        scaleY: 1,
        x: 0,
        rotation: 0,
        transformOrigin: '50% 100%',
        ease: Expo.easeOut
      },
      'begin'
    )
    tl.to(
      '.line1',
      0.7,
      {
        rotation: 0,
        x: 0,
        scaleX: 1,
        transformOrigin: '50% 100%',
        ease: Back.easeOut
      },
      'begin'
    )

    tl.timeScale(1.2)

    return tl
  };

  /* Follow controller */

  FollowController = classExtends(Stimulus.Controller);

  Object.defineProperties(FollowController.prototype, {
    following: {
      get: function () {
        return this.followButtonTarget.classList.contains('active-follow');
      }
    }
  });

  FollowController.prototype.toggleFollow = function () {
    try {
      this.following ? this.removeFollower() : this.addFollower();
    } catch (err) {
      console.warn(err.message);
    }
  };

  FollowController.prototype.removeFollower = function () {
    this.followersTarget.textContent = +this.followersTarget.textContent - 1;
    this.followButtonTarget.classList.remove('active-follow');
  };

  FollowController.prototype.addFollower = function () {
    this.followersTarget.textContent = +this.followersTarget.textContent + 1;
    this.followButtonTarget.classList.add('active-follow');
  };

  FollowController.targets = [
    'followButton',
    'followers',
  ];

  /**
   * App
   */

  application = Stimulus.Application.start();

  application.register('drawer', MenuDrawerController);
  application.register('navigation', NavigationController);
  application.register('mapcontain', MapController);
  application.register('follow', FollowController);
  application.register('place', PlaceController);

  // Use morphdom instead of Turbolinks's default render method
  Turbolinks.SnapshotRenderer.prototype.assignNewBody = function () {
    morphdom(document.body, this.newBody);
  };

  Turbolinks.start();

  document.addEventListener('turbolinks:click', function () {
    document.body.classList.add('is-loading');
  });

  document.addEventListener('turbolinks:before-render', function (e) {
    e.data.newBody.classList.add('is-rendering');
  });

  document.addEventListener('turbolinks:load', function () {
    document.body.classList.remove('is-rendering');
  });
}(Stimulus, Turbolinks, TweenMax, TimelineMax, Sine, morphdom, mapboxgl));
