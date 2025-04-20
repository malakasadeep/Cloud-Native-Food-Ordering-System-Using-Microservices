import * as UserService from '../services/userServices.js';

export const register = async (req, res) => {
  try {
    const provider = await UserService.createUser(req.body);
    res.status(201).json(provider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await UserService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  const providers = await UserService.viewAll();
  res.json(providers);
};

export const getById = async (req, res) => {
  const provider = await UserService.viewById(req.params.id);
  res.json(provider);
};

export const remove = async (req, res) => {
  await UserService.deleteProvider(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

export const changeStatus = async (req, res) => {
  const updated = await UserService.updateStatus(req.params.id, req.body.status);
  res.json(updated);
};

export const update = async (req, res) => {
  const updated = await UserService.updateDetails(req.params.id, req.body);
  res.json(updated);
};
