// src/models.test.js
import {beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js'; // Assuming index.js exports Domma object

describe('Domma.models - Models Module Tests', () => {

  // Re-ensure basic HTML is present for Domma to function on document.body
  // Models might not strictly need DOM, but good practice for consistency
  beforeEach(() => {
    document.body.innerHTML = '<div id="test"></div>';
  });

  it('Models - create simple model', () => {
    const User = Domma.models.create({
      name: {type: 'string', default: ''},
      age: {type: 'number', default: 0}
    });
    expect(User.get('name')).toBe('');
    expect(User.get('age')).toBe(0);
  });

  it('Models - set and get values', () => {
    const User = Domma.models.create({
      name: {type: 'string'}
    });
    User.set('name', 'Alice');
    expect(User.get('name')).toBe('Alice');
  });

  it('Models - set multiple values', () => {
    const User = Domma.models.create({
      name: {type: 'string'},
      email: {type: 'string'}
    });
    User.set({name: 'Bob', email: 'bob@example.com'});
    expect(User.get('name')).toBe('Bob');
    expect(User.get('email')).toBe('bob@example.com');
  });

  it('Models - toJSON', () => {
    const User = Domma.models.create({
      name: {type: 'string', default: 'Test'}
    });
    const json = User.toJSON();
    expect(json.name).toBe('Test');
    expect(json).toEqual({name: 'Test'}); // More specific
  });

  it('Models - onChange callback', () => {
    const onChangeSpy = vi.fn();
    const User = Domma.models.create({
      name: {type: 'string'}
    });
    User.onChange(onChangeSpy);
    User.set('name', 'Changed');
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'name',
        newValue: 'Changed'
      })
    );
  });

  it('Models - validation required should throw error when setting invalid value', () => {
    const User = Domma.models.create({
      name: {type: 'string', required: true}
    });
    expect(() => User.set('name', '')).toThrow('Validation failed for name: Required field is empty');
  });

  it('Models - validation passes', () => {
    const User = Domma.models.create({
      name: {type: 'string', required: true}
    });
    User.set('name', 'Valid Name');
    const validation = User.validate();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]); // Expect empty array for no errors
  });

  it('Models - reset to defaults', () => {
    const User = Domma.models.create({
      name: {type: 'string', default: 'Default'}
    });
    User.set('name', 'Changed');
    User.reset();
    expect(User.get('name')).toBe('Default');
  });

  it('Models - pub/sub subscribe and publish', () => {
    const subscriberSpy = vi.fn();
    Domma.models.subscribe('test-event', subscriberSpy);
    Domma.models.publish('test-event', {message: 'hello'});
    expect(subscriberSpy).toHaveBeenCalledTimes(1);
    expect(subscriberSpy).toHaveBeenCalledWith({message: 'hello'});
  });

  it('Models - pub/sub once', () => {
    const onceSpy = vi.fn();
    Domma.models.once('once-event', onceSpy);
    Domma.models.publish('once-event');
    Domma.models.publish('once-event'); // Should not trigger again
    expect(onceSpy).toHaveBeenCalledTimes(1);
  });
});
