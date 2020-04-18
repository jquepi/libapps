// Copyright (c) 2012 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * PreferenceManager subclass managing global NaSSH preferences.
 *
 * This is currently just an ordered list of known connection profiles.
 *
 * @param {!Storage=} storage
 * @constructor
 * @extends {lib.PreferenceManager}
 */
nassh.PreferenceManager = function(storage) {
  if (!storage) {
    storage = nassh.defaultStorage;
  }
  lib.PreferenceManager.call(this, storage, '/nassh/');

  this.defineChildren('profile-ids', function(parent, id) {
    return new nassh.ProfilePreferenceManager(parent, id);
  });

  this.definePreferences([
    /**
     * The last version we showed release notes for.
     */
    ['welcome/notes-version', ''],

    /**
     * How many times we've shown the current release notes.
     */
    ['welcome/show-count', 0],
  ]);
};

nassh.PreferenceManager.prototype =
    Object.create(lib.PreferenceManager.prototype);
/** @override */
nassh.PreferenceManager.constructor = nassh.PreferenceManager;

/** @return {!nassh.PreferenceManager} */
nassh.PreferenceManager.prototype.createProfile = function() {
  return /** @type {!nassh.PreferenceManager} */ (
      this.createChild('profile-ids'));
};

/** @param {string} id */
nassh.PreferenceManager.prototype.removeProfile = function(id) {
  this.removeChild('profile-ids', id);
};

/**
 * @param {string} id
 * @return {!nassh.PreferenceManager}
 */
nassh.PreferenceManager.prototype.getProfile = function(id) {
  return /** @type {!nassh.PreferenceManager} */ (
      this.getChild('profile-ids', id));
};

/**
 * lib.PreferenceManager subclass managing per-connection preferences.
 *
 * @param {!lib.PreferenceManager} parent
 * @param {string} id
 * @constructor
 * @extends {lib.PreferenceManager}
 */
nassh.ProfilePreferenceManager = function(parent, id) {
  lib.PreferenceManager.call(this, parent.storage,
                             '/nassh/profiles/' + id);

  this.id = id;

  this.definePreferences([
    /**
     * The free-form description of this connection profile.
     */
    ['description', ''],

    /**
     * The username.
     */
    ['username', ''],

    /**
     * The hostname or IP address.
     */
    ['hostname', ''],

    /**
     * The port, or null to use the default port.
     */
    ['port', null],

    /**
     * Options string for nassh itself (e.g. relay settings).
     */
    ['nassh-options', ''],

    /**
     * The private key file to use as the identity for this extension.
     *
     * Must be relative to the /.ssh/ directory.
     */
    ['identity', ''],

    /**
     * The argument string to pass to the ssh executable.
     *
     * Use '--' to separate ssh arguments from the target command/arguments.
     */
    ['argstr', ''],

    /**
     * The terminal profile to use for this connection.
     */
    ['terminal-profile', ''],

    /**
     * The base path used when mounting via SFTP.
     */
    ['mount-path', ''],
  ]);
};

nassh.ProfilePreferenceManager.prototype =
    Object.create(lib.PreferenceManager.prototype);
/** @override */
nassh.ProfilePreferenceManager.constructor = nassh.ProfilePreferenceManager;
